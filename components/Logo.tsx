import Image from "next/image";

export default function Logo() {
    return (
        <div className="flex items-center justify-center gap-1">
            <Image
                src="/logo.png"
                alt="Invoice"
                width={30}
                height={30}
            />
            <p className="text-xl font-semibold tracking-wide">
                Generate Invoice
            </p>
        </div>
    )
}