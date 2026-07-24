"use client";

import {
  createParser,
  parseAsBoolean,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
  type SingleParserBuilder,
} from "nuqs";
import { useCallback, useMemo, useState } from "react";

import type {
  Control,
  ControlSchema,
  ControlValue,
  SchemaValues,
} from "@/components/demos/control-schema";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/** Trims scrubber float noise (0.30000000000000004 → "0.3"). */
const parseAsControlNumber = createParser<number>({
  parse(query) {
    const value = Number.parseFloat(query);
    return Number.isFinite(value) ? value : null;
  },
  serialize(value) {
    return String(Number(value.toFixed(4)));
  },
});

/**
 * Serializes "#d1dbff" as "d1dbff" so URLs stay free of %23 escapes.
 * A color's `auto` sentinel (its default) passes through untouched.
 */
function colorParser(sentinel: string | undefined) {
  return createParser<string>({
    parse(query) {
      if (sentinel !== undefined && query === sentinel) return query;
      const value = `#${query}`;
      return HEX_COLOR.test(value) ? value.toLowerCase() : null;
    },
    serialize(value) {
      return value.startsWith("#") ? value.slice(1).toLowerCase() : value;
    },
  });
}

type ControlParser = SingleParserBuilder<ControlValue> & {
  readonly defaultValue: ControlValue;
};

function parserFor(control: Control) {
  switch (control.kind) {
    case "scrub":
      return parseAsControlNumber.withDefault(control.defaultValue);
    case "toggle":
      return parseAsBoolean.withDefault(control.defaultValue);
    case "radio":
      return parseAsStringLiteral(
        control.options.map((option) => option.value),
      ).withDefault(control.defaultValue);
    case "color":
      return colorParser(
        control.auto !== undefined ? control.defaultValue : undefined,
      ).withDefault(control.defaultValue.toLowerCase());
    case "custom":
      return typeof control.defaultValue === "number"
        ? parseAsControlNumber.withDefault(control.defaultValue)
        : typeof control.defaultValue === "boolean"
          ? parseAsBoolean.withDefault(control.defaultValue)
          : parseAsString.withDefault(control.defaultValue);
  }
}

function buildParsers(schema: ControlSchema): Record<string, ControlParser> {
  return Object.fromEntries(
    Object.entries(schema).map(([key, control]) => [key, parserFor(control)]),
  ) as Record<string, ControlParser>;
}

/**
 * URL-persisted state for a control schema. Values live in the query
 * string (shallow, throttled `history.replaceState`; defaults are removed
 * from the URL), so the address bar is always a shareable link to the
 * exact configuration on screen.
 */
export interface DemoControlsHandle<S extends ControlSchema = ControlSchema> {
  schema: S;
  values: SchemaValues<S>;
  setValue<K extends keyof S & string>(key: K, value: SchemaValues<S>[K]): void;
  reset(): void;
  isDefault: boolean;
}

export function useDemoControls<S extends ControlSchema>(
  schema: S,
): DemoControlsHandle<S> {
  // Schemas are module-level constants; parsers are derived once.
  const [parsers] = useState(() => buildParsers(schema));
  const [state, setState] = useQueryStates(parsers, { history: "replace" });

  const values = state as SchemaValues<S>;

  const setValue = useCallback(
    (key: string, value: ControlValue) => {
      void setState({ [key]: value });
    },
    [setState],
  );

  const reset = useCallback(() => {
    void setState(null);
  }, [setState]);

  const isDefault = useMemo(
    () =>
      Object.entries(schema).every(
        ([key, control]) => values[key] === control.defaultValue,
      ),
    [schema, values],
  );

  return useMemo(
    () => ({ schema, values, setValue, reset, isDefault }),
    [schema, values, setValue, reset, isDefault],
  );
}
