import { supabaseAdmin } from '../utils/supabase'; 

interface ClerkUserData {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string | null;
    last_name: string | null;
}

interface SupabaseUserData {
    clerk_user_id: string;
    email: string;
    full_name: string;
    academic_level?: string | null; 
}

export async function handleUserCreation(userData: ClerkUserData) {
    const primaryEmail = userData.email_addresses[0]?.email_address;

     if (!primaryEmail) {
        console.error(
            'SUPABASE_ERROR: handleUserCreation: No primary email address found for Clerk user. Aborting insertion.',
            userData.id
        );
        throw new Error('Database insertion failed: No primary email address provided.');
    }

    const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
    
    const dataToInsert: SupabaseUserData = {
        clerk_user_id: userData.id,
        email: primaryEmail,
        full_name: fullName,
        academic_level: null, 
    };

    const { error } = await supabaseAdmin
        .from('users')
        .insert(dataToInsert);

    if (error) {
        console.error('SUPABASE_ERROR: Failed to insert new user:', error.message);
        throw new Error('Database insertion failed for user.created');
    }
    console.log(`User created successfully for Clerk ID: ${userData.id}`);
}

export async function handleUserUpdate(userData: ClerkUserData) {
    const primaryEmail = userData.email_addresses[0]?.email_address;
    const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();

    const { error } = await supabaseAdmin
        .from('users')
        .update({
            email: primaryEmail,
            full_name: fullName,
        })
        .eq('clerk_user_id', userData.id);

    if (error) {
        console.error('SUPABASE_ERROR: Failed to update user:', error.message);
        throw new Error('Database update failed for user.updated');
    }
    console.log(`User updated successfully for Clerk ID: ${userData.id}`);
}

export async function handleUserDeletion(clerkUserId: string) {
    const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('clerk_user_id', clerkUserId);

    if (error) {
        console.error('SUPABASE_ERROR: Failed to delete user:', error.message);
        throw new Error('Database deletion failed for user.deleted');
    }
    console.log(`User deleted successfully for Clerk ID: ${clerkUserId}`);
}