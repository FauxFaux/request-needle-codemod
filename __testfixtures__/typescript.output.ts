import * as request from "request-promise-native";
import * as needle from "needle";

async function foo() {
  const a = await needle("get", "http://foo");
}
