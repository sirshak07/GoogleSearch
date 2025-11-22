export interface SearchResult {
  text: string;
  sources: GroundingSource[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

// Helper types for navigating the raw Gemini response structure if needed
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}
