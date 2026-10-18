export type Category = "Developer" | "Minecraft" | "Creative" | "Quick tools";
export type ToolDef = { slug: string; name: string; description: string; category: Category; tags: string[]; icon: string; featured?: boolean };
export const tools: ToolDef[] = [
 {slug:"json-formatter",name:"JSON Formatter",description:"Format, validate, and inspect JSON with clear errors.",category:"Developer",tags:["JSON","format","validate"],icon:"Braces",featured:true},
 {slug:"base64",name:"Base64 Encoder / Decoder",description:"Encode or decode text safely, including Unicode.",category:"Developer",tags:["encode","decode","unicode"],icon:"Binary"},
 {slug:"uuid-generator",name:"UUID v4 Generator",description:"Generate cryptographically strong random identifiers.",category:"Developer",tags:["uuid","random","id"],icon:"Fingerprint",featured:true},
 {slug:"url-codec",name:"URL Encoder / Decoder",description:"Encode or decode URL components without surprises.",category:"Developer",tags:["url","encode","decode"],icon:"Link"},
 {slug:"sha256",name:"SHA-256 Hash",description:"Create a SHA-256 digest with the Web Crypto API.",category:"Developer",tags:["hash","crypto","sha"],icon:"ShieldCheck"},
 {slug:"uuid-validator",name:"UUID Validator",description:"Check UUID syntax and identify its version.",category:"Developer",tags:["uuid","validate","id"],icon:"BadgeCheck"},
 {slug:"json-diff",name:"JSON Diff",description:"Compare two JSON values and pinpoint added, removed, and changed fields.",category:"Developer",tags:["json","diff","compare"],icon:"Braces"},
 {slug:"text-diff",name:"Text Diff",description:"Compare two text snippets line by line and see what changed.",category:"Developer",tags:["text","diff","compare"],icon:"AlignLeft"},
 {slug:"jwt-decoder",name:"JWT Decoder",description:"Read a token’s header and payload locally without verifying its signature.",category:"Developer",tags:["jwt","token","decode"],icon:"KeyRound"},
 {slug:"motd-gradient",name:"MOTD Gradient Generator",description:"Build smooth hex gradients for Minecraft server MOTDs.",category:"Minecraft",tags:["minecraft","motd","hex"],icon:"Blend",featured:true},
 {slug:"minecraft-color",name:"Minecraft Color Converter",description:"Convert HEX and RGB values to Minecraft color codes.",category:"Minecraft",tags:["minecraft","color","rgb"],icon:"Pipette"},
 {slug:"rank-prefix",name:"Rank Prefix Generator",description:"Compose formatted rank prefixes with a live preview.",category:"Minecraft",tags:["minecraft","rank","format"],icon:"Crown"},
 {slug:"server-icon",name:"Server Icon Resizer",description:"Resize a square image to the 64×64 server icon format.",category:"Minecraft",tags:["minecraft","image","png"],icon:"Image"},
 {slug:"loot-simulator",name:"Loot Drop Simulator",description:"Run reproducible drop simulations with configurable odds.",category:"Minecraft",tags:["minecraft","loot","probability"],icon:"Dices"},
 {slug:"color-palette",name:"HEX Color Palette",description:"Explore harmonious colors and accessible contrast ratios.",category:"Creative",tags:["color","palette","contrast"],icon:"Palette",featured:true},
 {slug:"gradient-generator",name:"Gradient Generator",description:"Create CSS gradients and copy production-ready code.",category:"Creative",tags:["css","gradient","design"],icon:"Blend"},
 {slug:"weapon-name",name:"Fantasy Weapon Names",description:"Forge evocative names for legendary gear.",category:"Creative",tags:["fantasy","names","generator"],icon:"Swords"},
 {slug:"username-generator",name:"Username Generator",description:"Generate distinctive handles from a vibe or keyword.",category:"Creative",tags:["username","handle","generator"],icon:"AtSign"},
 {slug:"qr-generator",name:"QR Code Generator",description:"Create and download a QR code from text or a URL.",category:"Quick tools",tags:["qr","code","download"],icon:"QrCode"},
 {slug:"word-counter",name:"Word & Character Counter",description:"Count words, characters, sentences, and reading time.",category:"Quick tools",tags:["words","text","count"],icon:"AlignLeft"},
 {slug:"unix-timestamp",name:"Unix Timestamp Converter",description:"Convert timestamps and local dates in both directions.",category:"Quick tools",tags:["unix","timestamp","date"],icon:"Clock3"},
 {slug:"unit-converter",name:"Unit Converter",description:"Convert common length, weight, and temperature units.",category:"Quick tools",tags:["units","convert","measure"],icon:"ArrowLeftRight"},
 {slug:"password-generator",name:"Secure Password Generator",description:"Generate strong passwords with browser cryptography.",category:"Quick tools",tags:["password","secure","random"],icon:"KeyRound"}
];
export const categories: Category[] = ["Developer","Minecraft","Creative","Quick tools"];
