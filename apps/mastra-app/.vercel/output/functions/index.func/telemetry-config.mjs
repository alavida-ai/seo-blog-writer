const telemetry = {
  serviceName: "seo-blogs-app",
  enabled: true,
  sampling: {
    type: "always_on"
    // Capture all traces for debugging
  },
  export: {
    type: "otlp",
    endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "https://cloud.langfuse.com/api/public/otel/v1/traces",
    headers: process.env.OTEL_EXPORTER_OTLP_HEADERS ? Object.fromEntries(process.env.OTEL_EXPORTER_OTLP_HEADERS.split(",").map((header) => {
      const [key, value] = header.trim().split("=");
      return [key, value];
    })) : void 0
  }
};

export { telemetry };
