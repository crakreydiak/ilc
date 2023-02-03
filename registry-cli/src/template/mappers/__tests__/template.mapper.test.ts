import { TemplateMapper } from "../template.mapper";

describe("TemplateMapper", () => {
  it("should create template", () => {
    const template = TemplateMapper.createTemplate({
      name: "test",
      content: "content",
    });

    expect(template).toBeDefined();
    expect(template.name).toBe("test");
    expect(template.content).toBe("content");
  });

  it("should create template dto", () => {
    const templateDto = TemplateMapper.createDto(
      TemplateMapper.createTemplate({ name: "test", content: "content" })
    );

    expect(templateDto).toBeDefined();
    expect(templateDto.name).toBe("test");
    expect(templateDto.slots).toEqual([]);
    expect(templateDto.content).toBe("content");
  });

  it("should create persistence template", () => {
    const template = TemplateMapper.createPersistence(
      TemplateMapper.createTemplate({ name: "test", content: "content" })
    );

    expect(template).toBeDefined();
    expect(template.name).toBe("test");
    expect(template.content).toBe("content");
  });
});
