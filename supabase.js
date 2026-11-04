/* ==========================================
   S.A.F.E. - Supabase & Data Persistence Layer
   ========================================== */

const SUPABASE_URL = 'https://nubddxxggdrduiwbrich.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zwd1mCNXQXDz-Hxye_u9sw_GMy3kqXu';

let supabaseClient = null;

// Initialize Supabase if CDN library is loaded
if (typeof supabase !== 'undefined' && SUPABASE_URL && !SUPABASE_URL.includes('YOUR_SUPABASE_PROJECT_ID')) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Data persistence & API interface
const SafeData = {
    // Default demonstration shelters matching script.js
    defaultShelters: [
        { id: 1, name: "City Community Hall", city: "Ludhiana", capacity: 100, available: 45, facilities: ["Wheelchair Access", "Medical Support"] },
        { id: 2, name: "Northside Relief Centre", city: "Ludhiana", capacity: 80, available: 28, facilities: ["Food Services", "Family Rooms"] },
        { id: 3, name: "Community Relief Shelter", city: "Ludhiana", capacity: 60, available: 16, facilities: ["Medical Support", "Wheelchair Access"] },
        { id: 4, name: "Green Valley Emergency Centre", city: "Jalandhar", capacity: 120, available: 8, facilities: ["Food Services", "Medical Support"] },
        { id: 5, name: "Hope Community Shelter", city: "Chandigarh", capacity: 90, available: 0, facilities: ["Family Rooms", "Wheelchair Access"] },
        { id: 6, name: "Central Relief Facility", city: "Amritsar", capacity: 150, available: 65, facilities: ["Food Services", "Medical Support", "Family Rooms"] }
    ],

    // GET SHELTERS
    async getShelters() {
        if (supabaseClient) {
            const { data, error } = await supabaseClient.from('shelters').select('*').order('id', { ascending: true });
            if (!error && data && data.length > 0) return data;
        }
        const local = localStorage.getItem('safeShelterAvailability');
        return local ? JSON.parse(local) : this.defaultShelters;
    },

    // GET ALLOCATION REQUESTS
    async getRequests(userId = null) {
        if (supabaseClient) {
            // Try query with shelters join first
            let query = supabaseClient.from('allocation_requests').select('*, shelters(name, city)');
            if (userId) query = query.eq('user_id', userId);
            let { data, error } = await query.order('created_at', { ascending: false });
            
            // If join query fails (e.g. no foreign key constraint), fallback to direct table select
            if (error) {
                let simpleQuery = supabaseClient.from('allocation_requests').select('*');
                if (userId) simpleQuery = simpleQuery.eq('user_id', userId);
                const simpleRes = await simpleQuery.order('created_at', { ascending: false });
                if (!simpleRes.error && simpleRes.data) return simpleRes.data;
            } else if (data) {
                return data;
            }
        }
        // Local Storage Fallback
        const local = localStorage.getItem('safeAllocationRequests');
        const requests = local ? JSON.parse(local) : [];
        if (userId) return requests.filter(r => r.user_id === userId);
        return requests;
    },

    // CREATE ALLOCATION REQUEST
    async createRequest(requestData) {
        if (supabaseClient) {
            const { data, error } = await supabaseClient.from('allocation_requests').insert([{
                user_id: requestData.userId || null,
                shelter_id: requestData.shelterId,
                requester_name: requestData.name,
                requester_email: requestData.email,
                people: requestData.people,
                status: 'pending'
            }]).select();
            if (!error && data && data.length > 0) return { success: true, data: data[0] };
            return { success: false, message: error ? error.message : "Failed to insert request" };
        }

        // Local Storage Fallback
        const localRequests = JSON.parse(localStorage.getItem('safeAllocationRequests') || '[]');
        const newReq = {
            id: 'REQ-' + Date.now().toString().slice(-6),
            user_id: requestData.userId || 'demo-user',
            shelter_id: requestData.shelterId,
            shelter_name: requestData.shelterName,
            requester_name: requestData.name,
            requester_email: requestData.email,
            people: parseInt(requestData.people, 10),
            status: 'pending',
            created_at: new Date().toISOString()
        };
        localRequests.unshift(newReq);
        localStorage.setItem('safeAllocationRequests', JSON.stringify(localRequests));
        return { success: true, data: newReq };
    },

    // APPROVE REQUEST
    async approveRequest(requestId, shelterId, peopleCount) {
        if (supabaseClient) {
            const { data, error } = await supabaseClient.rpc('approve_allocation_request', { target_request_id: requestId });
            if (!error) return data;
            return { success: false, message: error.message };
        }

        const shelters = await this.getShelters();
        const shelter = shelters.find(s => s.id == shelterId);
        if (!shelter || shelter.available < peopleCount) {
            return { success: false, message: "Insufficient available capacity!" };
        }

        shelter.available -= peopleCount;
        localStorage.setItem('safeShelterAvailability', JSON.stringify(shelters));

        const requests = await this.getRequests();
        const req = requests.find(r => r.id == requestId);
        if (req) req.status = 'approved';
        localStorage.setItem('safeAllocationRequests', JSON.stringify(requests));

        return { success: true, message: "Request approved successfully." };
    },

    // REJECT / CANCEL REQUEST
    async updateRequestStatus(requestId, status) {
        if (supabaseClient) {
            const { error } = await supabaseClient.from('allocation_requests').update({ status }).eq('id', requestId);
            return { success: !error };
        }

        const requests = await this.getRequests();
        const req = requests.find(r => r.id == requestId);
        if (req) {
            req.status = status;
            localStorage.setItem('safeAllocationRequests', JSON.stringify(requests));
            return { success: true };
        }
        return { success: false };
    }
};

// Explicitly attach to window object to guarantee global availability
window.SafeData = SafeData;