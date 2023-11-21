import Image from "next/image"

export default function Logo() {
        return (
                <div className="flex flex-row items-center">
                        <Image src="/logo.png" alt="Logo" width={50} height={50} />
                </div>
        )
}