import { SidebarNavigation } from "@/components/sidebar-navigation";
import { AiWriterInterface } from "@/components/ai-writer/ai-writer-interface";

export default function WriterPage() {
  return (
    <div className="flex h-screen">
       <div className="flex-1 p-4">
        <AiWriterInterface initialPrompt="" />
      </div>
    </div>
  );
}
