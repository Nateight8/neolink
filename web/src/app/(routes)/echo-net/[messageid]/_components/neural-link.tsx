import { NeuralIndicator } from "@/components/chats/neural-indicator";

export default function NeuralLink({
  neuralLinkStrength,
}: {
  neuralLinkStrength: number;
}) {
  return (
    <>
      <div className="px-4 py-2 bg-cyan-950/20 border-b border-cyan-900 flex items-center justify-between">
        <div className="flex items-center">
          <NeuralIndicator strength={neuralLinkStrength} />
          <span className="text-xs text-cyan-400 ml-2 font-mono">
            NEURAL_LINK: {Math.round(neuralLinkStrength * 100)}% STRENGTH
          </span>
        </div>
        <div className="flex items-center">
          {/* {ACTIVE_CONVERSATION_MESSAGES?.isEncrypted && (
                      <Badge
                        variant="outline"
                        className="bg-black/50 border-fuchsia-500 text-fuchsia-400 text-xs flex items-center"
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        ENCRYPTED
                      </Badge>
                    )} */}
        </div>
      </div>
    </>
  );
}
