export const pipelineTrace = [
  {
    step_number: 1,
    step_name: "Ingestion & State Initialization",
    active_node: "Collector",
    node_type: "entrypoint",
    status_badge: "INITIALIZED",
    badge_variant: "neutral",
    description: "External data stream captured and wrapped into an immutable state envelope with runtime metadata.",
    state: {
      session_id: "run_984f2a",
      raw_payload: "Encrypted raw document stream (bytes)",
      metadata: {
        source_type: "external_stream",
        timestamp: "2026-10-07T22:15:00Z"
      },
      retry_count: 0,
      status: "INITIALIZED"
    }
  },
  {
    step_number: 2,
    step_name: "Local Multimodal Extraction",
    active_node: "Node 1: Extractor",
    node_type: "inference",
    status_badge: "EXTRACTED",
    badge_variant: "info",
    description: "Multimodal local model analyzes payload semantics and projects structured candidate attributes.",
    state: {
      session_id: "run_984f2a",
      extracted_candidate: {
        entity_id: "ent_7721",
        semantic_attributes: {
          category: "service_record",
          declared_value: 450.0
        },
        confidence_score: 0.82
      },
      retry_count: 0,
      status: "EXTRACTED"
    }
  },
  {
    step_number: 3,
    step_name: "Deterministic Schema Audit (Failed)",
    active_node: "Node 2: Verifier",
    node_type: "audit",
    status_badge: "REJECTED_NEEDS_RETRY",
    badge_variant: "error",
    description: "Pydantic validator catches constraint violations: missing required signature and bound overflow.",
    state: {
      session_id: "run_984f2a",
      audit_result: {
        is_valid: false,
        violations: [
          "Missing required field: schema_signature",
          "Value out of bounds: declared_value"
        ],
        validator: "PydanticSchemaVerifier"
      },
      retry_count: 0,
      status: "REJECTED_NEEDS_RETRY"
    }
  },
  {
    step_number: 4,
    step_name: "Self-Correction Loop Triggered",
    active_node: "Feedback Edge",
    node_type: "routing",
    status_badge: "RETRY_TRIGGERED",
    badge_variant: "warning",
    description: "Conditional routing evaluates retry_count < max_retries and re-routes feedback context to Extractor.",
    state: {
      session_id: "run_984f2a",
      feedback_context: "Injecting validation errors back to Extractor LLM",
      retry_count: 1,
      max_retries: 1,
      status: "RETRY_TRIGGERED"
    }
  },
  {
    step_number: 5,
    step_name: "Audit Passed",
    active_node: "Node 2: Verifier",
    node_type: "audit",
    status_badge: "APPROVED",
    badge_variant: "success",
    description: "Self-corrected candidate fulfills schema signature constraints with 0.98 confidence score.",
    state: {
      session_id: "run_984f2a",
      extracted_candidate: {
        entity_id: "ent_7721",
        schema_signature: "sha256_9f8e7d",
        semantic_attributes: {
          category: "service_record",
          declared_value: 450.0
        },
        confidence_score: 0.98
      },
      audit_result: {
        is_valid: true,
        violations: []
      },
      retry_count: 1,
      status: "APPROVED"
    }
  },
  {
    step_number: 6,
    step_name: "Idempotent Persistence",
    active_node: "Persist Validated Payload",
    node_type: "sink",
    status_badge: "COMPLETED",
    badge_variant: "success",
    description: "Deduplication check passes (is_duplicate: false). Payload safely committed to Supabase raw_events.",
    state: {
      session_id: "run_984f2a",
      is_duplicate: false,
      persistence_sink: "Supabase (raw_events)",
      transaction_status: "COMMITTED",
      status: "COMPLETED"
    }
  }
];
