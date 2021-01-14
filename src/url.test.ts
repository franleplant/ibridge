import { getOrigin } from "./url";

test("positive cases", () => {
  const cases = [
    ["https://www.example.com", "https://www.example.com"],
    ["http://www.example.com", "http://www.example.com"],
    ["http://www.example.com:8000", "http://www.example.com:8000"],
    ["http://www.example.com/some/path", "http://www.example.com"],
    ["http://localhost:8000", "http://localhost:8000"],
  ];

  cases.forEach(([input, expected]) => {
    expect(getOrigin(input)).toEqual(expected);
  });
});
