import { notFound } from "next/navigation";
import { tools } from "@/lib/tools";
import { ToolWorkspace } from "@/components/tool-workspace";
export function generateStaticParams(){return tools.map(tool=>({slug:tool.slug}))}
export default async function ToolPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!tools.some(tool=>tool.slug===slug))notFound();return <ToolWorkspace slug={slug}/>}
