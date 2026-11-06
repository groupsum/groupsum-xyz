import test from "node:test";
import assert from "node:assert/strict";
import { observationSeries } from "../src/features/catalog/activity-series.mjs";

test("preserves irregular timestamps and zeros without filling gaps", () => {
  const points = [{ label: "2026-01-01", value: 5 }, { label: "2026-01-09", value: 0 }, { label: "2026-01-11", value: 3 }, { label: "bad", value: 99 }, { label: "2026-01-10", value: NaN }];
  assert.deepEqual(observationSeries(points).map((point) => point.value), [5, 0, 3]);
  assert.deepEqual(observationSeries(points, 0, true).map((point) => [point.value, point.from]), [[-5, "2026-01-01"], [3, "2026-01-09"]]);
  assert.deepEqual(observationSeries(points, 3).map((point) => point.value), [0, 3]);
});
test("single observations do not manufacture changes", () => {
  assert.equal(observationSeries([{ label: "2026-01-01", value: 0 }]).length, 1);
  assert.equal(observationSeries([{ label: "2026-01-01", value: 0 }], 0, true).length, 0);
});
