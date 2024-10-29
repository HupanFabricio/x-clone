"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		redirect("/error");
	}

	revalidatePath("/", "layout");
	redirect("/");
}

export async function signup(formData: FormData) {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signUp(data);

	if (error) {
		redirect("/error");
	}

	revalidatePath("/", "layout");
	redirect("/");
}

export async function handleSignIn() {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "github",
		options: {
			redirectTo: "http://localhost:3000/auth/callback",
		},
	});

	if (error) {
		console.log(error);
	} else {
		return redirect(data.url);
	}
}

export async function handleSignOut() {
	const supabase = await createClient();

	await supabase.auth.signOut();
}