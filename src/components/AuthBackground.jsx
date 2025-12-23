import ThreeBackgroundScene from "./ThreeBackground";

export default function AuthBackground({ children }) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-[#120a2e] via-[#2b1055] to-[#0d0d0d] relative overflow-hidden">
            <ThreeBackgroundScene />

            {/* Ambient gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(75,43,127,0.15),transparent_70%)] pointer-events-none" />

            {children}
        </div>
    );
}
