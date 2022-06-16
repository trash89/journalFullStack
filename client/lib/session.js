export default function withSession(
  f = (req, res) => {
    console.log("callback");
    return req;
  }
) {
  console.log("withSession");
  f();
}
