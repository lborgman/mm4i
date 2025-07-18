// @ts-check
const MM4I_SHARE_LINK_VER = "0.0.04";
const MM4I_SHARE_LINK_FILE = "mm4i-share-link.js";
window["logConsoleHereIs"](`here is ${MM4I_SHARE_LINK_FILE}, module, ${MM4I_SHARE_LINK_VER}`);
console.log(`%chere is ${MM4I_SHARE_LINK_FILE} ${MM4I_SHARE_LINK_VER}`, "font-size:20px;");
if (document.currentScript) { throw `${MM4I_SHARE_LINK_FILE} is not loaded as module`; }

/*
    https://developers.facebook.com/tools/debug/ - Facebook Sharing Debugger
    https://www.whatsmydns.net/#AAAA/some4i.eu
*/

// https://grok.com/chat/f10b142c-077f-452c-843d-d1340481125a

const MM4I_SUPABASE_PROJECT = "mm4ishare";
// const MM4I_SUPABASE_ID = "";
const MM4I_SUPABASE_URL = "https://dpjaiwxctqpdezuinieq.supabase.co";

// const MM4I_PWA = "https://lborgman.github.io/mm4i/mm4i.html";
// const MM4I_PWA = location.origin + "/mm4i.html";
const MM4I_PWA = location.origin + location.pathname;

const MM4I_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwamFpd3hjdHFwZGV6dWluaWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzUyOTQsImV4cCI6MjA2NzcxMTI5NH0.5dqHOqTm4wK-JWyu7Ec20J4HRGqd9tN4_JpQ0hvB8kc";

/**
 * 
 * @param {object} jsonSharedMindmap 
 * @param {string} shareTitle 
 * @param {string} shareText 
 */
export async function saveDataToShare(jsonSharedMindmap, shareTitle, shareText) {
    if (!shareTitle) throw Error("NO SHARE TITLE GIVEN");
    if (!shareText) throw Error("NO SHARE TEXT GIVEN");
    await saveToSupabaseThenShare(jsonSharedMindmap, shareTitle, shareText);
}

async function saveToSupabaseThenShare(jsonSharedMindmap, shareTitle, shareText) {
    const accessToken = crypto.randomUUID(); // Generate a random token for extra security

    try {
        const response = await fetch(`${MM4I_SUPABASE_URL}/rest/v1/shared_data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'apikey': '<your-supabase-anon-key>',
                'apikey': MM4I_SUPABASE_ANON_KEY,
                // 'Authorization': 'Bearer <your-supabase-anon-key>',
                'Authorization': `Bearer ${MM4I_SUPABASE_ANON_KEY}`,
                'Prefer': 'return=representation', // Return the inserted row
            },
            body: JSON.stringify({
                data: jsonSharedMindmap,
                access_token: accessToken, // Include if using token-based access
            }),
        });

        if (!response.ok) {
            const msg = `Failed save data on supabase: ${response.status}`;
            console.log(msg);
            throw new Error(msg);
        }
        if (response.status != 201) {
            const msg = `Expected 201 from supabase, got ${response.status}`;
            console.log(msg);
            throw new Error(msg);
        }

        const txtResult = await response.text();
        console.log({ resultTxt: txtResult });
        const jsonResult = JSON.parse(txtResult);
        const postId = jsonResult[0].id; // Get the UUID from Supabase
        // const shareTitle = "share title";
        // const shareText = "share text";

        shareLinkWithPostContent(postId, accessToken, shareTitle, shareText);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save data');
    }
}

// Include accessToken in the URL if using token-based access
// const shareUrl = `https://your-pwa.com/share?post=${encodeURIComponent(postId)}&token=${encodeURIComponent(accessToken)}`;
// const shareUrl = `${MM4I_PWA}?share=${encodeURIComponent(postId)}&token=${encodeURIComponent(accessToken)}`;
// FIX-ME: make link compotion more readable
function shareLinkWithPostContent(postId, accessToken, shareTitle, shareText) {
    const sharePost =
        // encodeURIComponent(
        // `post=${postId}&token=${accessToken}&title=${shareTitle}&text=${shareText}`
        // "sharepost="+encodeURIComponent( postId)+"&token="+encodeURIComponent(accessToken);
        // encodeURIComponent( postId)+"&token="+encodeURIComponent(accessToken);
        encodeURIComponent(postId);
    ;
    const shareToken = encodeURIComponent(accessToken);
    // const shareUrl = `${MM4I_PWA}?share=${sharePart}`;
    const shareUrl = `${MM4I_PWA}?sharepost=${sharePost}&token=${shareToken}&title=${shareTitle}&text=${shareText}`;
    const shareURL = new URL(MM4I_PWA);
    shareURL.searchParams.set( "sharepost", sharePost);
    shareURL.searchParams.set( "token", shareToken);
    shareURL.searchParams.set( "title", shareTitle);
    shareURL.searchParams.set( "text", shareText);
    // const shareUrl = shareURL.toString();
    // const shareURL = new URL(MM4I_PWA);
    if (navigator.share) {
        navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl,
        })
            .then(() => console.log('Shared successfully'))
            .catch(error => {
                console.error('Error sharing:', error);
                copyToClipboard(shareUrl);
            });
    } else {
        copyToClipboard(shareUrl);
    }
}

function copyToClipboard(url) {
    navigator.clipboard.writeText(url)
        .then(() => alert('Link copied to clipboard: ' + url))
        .catch(error => {
            console.error('Error copying:', error);
            alert('Copy this link: ' + url);
        });
}

// document.getElementById('saveAndShareButton').addEventListener('click', saveAndShareData);




export async function getSharedData(sharedParam) {
    console.log({ sharedParam });
    debugger;

    // const sp = new URLSearchParams(sharedParam);
    const sp = new URLSearchParams(location.search);

    // const postId = sp.get("post");
    const postId = sp.get("sharepost");
    if (!postId) {
        debugger;
        alert('Error: No post ID provided');
        return;
    }

    const accessToken = sp.get("token");
    if (!accessToken) {
        debugger;
        alert('Error: No accessToken provided');
        return;
    }

    // supabaseJs
    const srcSupabaseJs = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
    const modSupabaseJs = await import(srcSupabaseJs);
    console.log({ modSupabaseJs });

    // debugger;

    const supabase = modSupabaseJs.createClient(
        MM4I_SUPABASE_URL,
        MM4I_SUPABASE_ANON_KEY,
        {
            auth: { persistSession: false } // Avoid session persistence warnings
        }
    );
    console.log({ supabase });

    try {
        const { data, error } = await supabase
            .from('shared_data')
            .select('data')
            .eq('id', postId)
            .maybeSingle(); // Use maybeSingle to expect 0 or 1 record
        if (error) {
            throw new Error(`Failed to fetch supabase data: ${error.message}`);
        }
        if (!data) {
            debugger;
            return;
        }
        console.log({ data });
        const mindmapData = data.data;
        console.log({ mindmapData });
        // debugger;
        return mindmapData;

    } catch (error) {
        console.error('Error:', error);
        throw new Error(`Error fetching supabase data: ${error.message}`);
    }


    return;

    try {
        const headers = {
            'Content-Type': 'application/json',
            // 'apikey': '<your-supabase-anon-key>',
            'apikey': MM4I_SUPABASE_ANON_KEY,
            // 'Authorization': 'Bearer <your-supabase-anon-key>',
            'Authorization': `Bearer ${MM4I_SUPABASE_ANON_KEY}`,
        };
        if (accessToken) {
            headers['x-access-token'] = accessToken;
        }

        const response = await fetch(
            // `https://<your-supabase-project>.supabase.co/rest/v1/shared_data?id=eq.${postId}`,
            // `https://${MM4I_SUPABASE_PROJECT}.supabase.co/rest/v1/shared_data?id=eq.${postId}`,
            `${MM4I_SUPABASE_URL}/rest/v1/shared_data?id=eq.${postId}`,
            {
                method: 'POST',
                headers,
                body: JSON.stringify({}),
            }
        );

        if (response.ok) {
            const result = await response.json();
            console.log({ result })
            debugger;
            const data = result[0].data;
        } else {
            debugger;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

/*
const srcSupabaseJs = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const modSupabaseJs = await import(srcSupabaseJs);
console.log({ modSupabaseJs });

debugger;

const supabase = modSupabaseJs.createClient(MM4I_SUPABASE_URL, MM4I_SUPABASE_ANON_KEY);
console.log({ supabase });
*/

/*
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//or
// <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
const { createClient } = modSupabaseJs;

debugger;
// Create a single supabase client for interacting with your database
const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key');
console.log({ supabase });
debugger;
*/