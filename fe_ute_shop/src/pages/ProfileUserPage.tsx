import { useMemo } from "react";

interface UserProfile {
    email: string;
    fullName: string;
    phone: string;
    address: string;
    isVerified: boolean;
}

function initialsOf(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function safeLoadProfile(): UserProfile | null {
    // Tránh lỗi khi render SSR hoặc storage bị chặn
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem("demo_user_profile");
        return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch {
        return null;
    }
}

export default function ProfileView() {
    const fallback: UserProfile = useMemo(
        () => ({
            email: "user1@test.com",
            fullName: "Nguyễn Văn A",
            phone: "0987654321",
            address: "456 Đường XYZ, Quận 2, TP.HCM",
            isVerified: true,
        }),
        []
    );

    // Chỉ đọc localStorage một lần khi mount
    const user = useMemo(() => safeLoadProfile() ?? fallback, [fallback]);

    return (
        <div className="relative min-h-screen w-full text-white">
            <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" aria-hidden="true" />

            <div className="relative z-10 px-6 py-10">
                <div className="mx-auto max-w-3xl">
                    <header className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-semibold text-center leading-relaxed">
                            Hồ sơ người dùng
                        </h1>
                    </header>

                    <section
                        aria-label="Thông tin hồ sơ"
                        className="rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-md p-6 md:p-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 grid place-items-center text-xl font-bold text-slate-900">
                                    {initialsOf(user.fullName)}
                                </div>
                                <div className="leading-tight">
                                    <div className="text-lg font-semibold break-words">{user.fullName}</div>
                                    <div className="text-white/80 text-sm break-words">{user.email}</div>
                                </div>
                            </div>

                            <span
                                className={
                                    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium " +
                                    (user.isVerified
                                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30"
                                        : "bg-amber-500/15 text-amber-300 border border-amber-400/30")
                                }
                            >
                <span
                    className={
                        "h-2 w-2 rounded-full " +
                        (user.isVerified ? "bg-emerald-400" : "bg-amber-400")
                    }
                    aria-hidden="true"
                />
                                {user.isVerified ? "Đã xác minh" : "Chưa xác minh"}
              </span>
                        </div>

                        <div className="my-6 h-px w-full bg-white/10" />

                        {/* Thông tin chi tiết */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm text-white/80">Email</label>
                                <div className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 break-words">
                                    {user.email}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-white/80">Họ và tên</label>
                                <div className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 break-words">
                                    {user.fullName}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-white/80">Số điện thoại</label>
                                <div className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 break-words">
                                    {user.phone}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm text-white/80">Địa chỉ</label>
                                <div className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 break-words">
                                    {user.address}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
