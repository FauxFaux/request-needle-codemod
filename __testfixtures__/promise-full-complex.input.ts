import * as request from "request-promise-native";
import * as needle from "needle";

async function foo() {
  const a = await request({
    method: "GET",
    url: "http://foo",
    resolveWithFullResponse: true,
    simple: false,
  });
}
