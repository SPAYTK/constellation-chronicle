import { useState } from "react";
import { runAgent } from "@/ai/agent";
import { AgentInput, AgentOutput, AgentError } from "@/ai/types";

/**
 * Hook para interactuar con el agente IA del Sistema Lagrange
 * No es un chat - es un analizador crítico
 */
export function useAgent() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<AgentOutput | null>(null);
  const [error, setError] = useState<AgentError | null>(null);

  async function analyze(input: AgentInput) {
    setLoading(true);
    setError(null);
    try {
      const result = await runAgent(input);
      setOutput(result);
    } catch (err) {
      setError(err as AgentError);
      setOutput(null);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setOutput(null);
    setError(null);
  }

  return { 
    analyze, 
    output, 
    loading, 
    error,
    reset 
  };
}
