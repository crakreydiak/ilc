import { Template } from "../template";

describe("Template", () => {
  it("should be created", () => {
    const opts = { name: "something", content: "something" };
    const template = Template.create(opts);

    expect(template).toBeDefined();
    expect(template.name).toBe(opts.name);
    expect(template.slots).toEqual([]);
    expect(template.content).toBe(opts.content);
  });

  it("should map slot names based on the content", () => {
    const opts = {
      name: "something",
      content: `
        <body>
          <ilc-slot id="navbar" />
          <ilc-slot id="body" />
          <ilc-slot id="footer" />
        </body>
      `,
    };

    const template = Template.create(opts);
    expect(template.slots).toEqual(["navbar", "body", "footer"]);

    const template2 = Template.create({ ...opts, content: "" });
    expect(template2.slots).toEqual([]);
  });
});
