export const PAGE_BUILDER_VERSION = 1;

export type PageBlockType = "TEXT" | "IMAGE" | "VIDEO";
export type PageBlockPlacement = "FULL" | "LEFT" | "CENTER" | "RIGHT";

export type PageBuilderBlock = {
  id: string;
  type: PageBlockType;
  placement: PageBlockPlacement;
  text?: string;
  mediaId?: string;
  caption?: string;
};

type PageBuilderDocument = {
  version: typeof PAGE_BUILDER_VERSION;
  blocks: PageBuilderBlock[];
};

const validTypes = new Set<PageBlockType>([
  "TEXT",
  "IMAGE",
  "VIDEO",
]);

const validPlacements = new Set<PageBlockPlacement>([
  "FULL",
  "LEFT",
  "CENTER",
  "RIGHT",
]);

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function isBlock(value: unknown): value is PageBuilderBlock {
  if (!value || typeof value !== "object") {
    return false;
  }

  const block = value as Record<string, unknown>;
  const type = stringValue(block.type);
  const placement = stringValue(block.placement);

  return Boolean(
    stringValue(block.id) &&
      type &&
      validTypes.has(type as PageBlockType) &&
      placement &&
      validPlacements.has(placement as PageBlockPlacement),
  );
}

/**
 * Reads current structured content and safely supports pages created before
 * the builder existed. Existing plain text becomes one editable text block.
 */
export function getPageBuilderBlocks(content: string): PageBuilderBlock[] {
  const plainText = content.trim();

  if (!plainText) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(plainText);

    if (
      parsed &&
      typeof parsed === "object" &&
      (parsed as Record<string, unknown>).version === PAGE_BUILDER_VERSION &&
      Array.isArray((parsed as Record<string, unknown>).blocks)
    ) {
      return (parsed as { blocks: unknown[] }).blocks
        .filter(isBlock)
        .map((block) => ({
          id: block.id,
          type: block.type,
          placement: block.placement,
          ...(typeof block.text === "string" ? { text: block.text } : {}),
          ...(typeof block.mediaId === "string"
            ? { mediaId: block.mediaId }
            : {}),
          ...(typeof block.caption === "string"
            ? { caption: block.caption }
            : {}),
        }));
    }
  } catch {
    // Legacy plain text is intentionally handled below.
  }

  return [
    {
      id: "legacy-text",
      type: "TEXT",
      placement: "FULL",
      text: content,
    },
  ];
}

export function serializePageBuilderBlocks(
  blocks: PageBuilderBlock[],
): string {
  const document: PageBuilderDocument = {
    version: PAGE_BUILDER_VERSION,
    blocks: blocks.map((block) => ({
      id: block.id,
      type: block.type,
      placement: block.placement,
      ...(block.type === "TEXT" ? { text: block.text ?? "" } : {}),
      ...(block.type !== "TEXT" && block.mediaId
        ? { mediaId: block.mediaId }
        : {}),
      ...(block.type !== "TEXT" && block.caption
        ? { caption: block.caption }
        : {}),
    })),
  };

  return JSON.stringify(document);
}

export function createPageBuilderBlock(
  type: PageBlockType,
): PageBuilderBlock {
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    placement: "FULL",
    ...(type === "TEXT" ? { text: "" } : {}),
  };
}

export function getPageBuilderTextPreview(
  content: string,
): string {
  return getPageBuilderBlocks(content)
    .map((block) => {
      if (block.type === "TEXT") {
        return block.text?.trim() ?? "";
      }

      return `[${block.type === "IMAGE" ? "Image" : "Video"}]${
        block.caption ? ` ${block.caption}` : ""
      }`;
    })
    .filter(Boolean)
    .join("\n\n");
}
