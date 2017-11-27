export function serialize(string) {
  return string.replace(/\//g, "*");
}


export function deserialize(string) {
  return string.replace(/\*/g, "/");
}
