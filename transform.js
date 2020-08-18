const _cloneDeep = require('lodash.clonedeep');

module.exports = function(fileInfo, api, options) {
  const j = api.jscodeshift;
  const ast = j(fileInfo.source);
  ast.find('CallExpression', { callee: { name: 'request' }}).forEach(call => {
    const oldArgs = call.get().value.arguments;
    if (1 !== oldArgs.length) {
      return;
    }

    const arg = _cloneDeep(oldArgs[0]);
    const method = removeProperty(arg, 'method');
    const url = removeProperty(arg, 'url');
    if (method.value !== 'GET' || !url) {
      return;
    }
    method.value = method.value.toLowerCase();
    let args = [method, url];
    if (arg.properties.length) {
      args.push(arg);
    }
    call.replace(j.callExpression(j.identifier('needle'), args));
  });
  return ast.toSource();
};

function removeProperty(objLiteral, name) {
  const idx = objLiteral.properties.findIndex((prop) => prop && prop.key.name === name);
  if (-1 === idx) {
    return null;
  }
  const ret = objLiteral.properties[idx].value;
  objLiteral.properties.splice(idx, 1);
  return ret;
}
