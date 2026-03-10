
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UserEditProfilePage from "./UserEditProfile";
import { auth } from "@/lib/auth";

export default async function UserProfilePage() {
    const session = await auth()
    return (
        <div>
            <Dialog>
                <DialogTrigger className="w-full text-left px-2 py-1 cursor-pointer hover:bg-muted-foreground/20">
                    Profile
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Profile</DialogTitle>
                        <DialogDescription>Edit your profile details here</DialogDescription>
                    </DialogHeader>


                    {/* user profile display and editor */}
                    <UserEditProfilePage
                        firstName={session?.user?.firstName}
                        lastName={session?.user?.lastName}
                        email={session?.user?.email}
                        currency={session?.user?.currency}

                    />
                    
                </DialogContent>

            </Dialog>
        </div>
    )
}