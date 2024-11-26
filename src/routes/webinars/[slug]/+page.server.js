import fetchJson from "$lib/fetch-json"

const baseURL = 'https://fdnd-agency.directus.app/items/'

export async function load({params}) {
  const webinarURL = `${baseURL}avl_webinars?fields=video,date,title,transcript,description,id,views,resources.directus_files_id,speakers.avl_speakers_id.fullname,speakers.avl_speakers_id.slug,speakers.avl_speakers_id.profile_picture,speakers.avl_speakers_id.entitle,categories.avl_categories_id.name&filter[slug][_eq]=${params.slug}`
  const webinar = await fetchJson(webinarURL)

  const commentsURL = `${baseURL}avl_comments?fields=time_posted,content,parent_id,likes,id,user_id.profile_picture.id,user_id.profile_picture.title,user_id.fullname,replies.*.*.*&filter[webinar_id][_eq]=${webinar.data[0].id}`  
  const comments = await fetchJson(commentsURL)
  
  return {
    webinar: webinar.data[0],
    comments: comments.data
  }
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	comment: async ({ request, params }) => {
		const data = await request.formData();
    const timestamp = new Date().toISOString();
    const content = data.get('comment');

    const webinarData = await fetchJson(`${baseURL}avl_webinars?fields=id&filter[slug][_eq]=${params.slug}`)
    
    const user_id = 1;
    const webinar_id = webinarData.data[0].id;

    const response = await fetchJson(`${baseURL}avl_comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        time_posted: timestamp,
        content: content,
        user_id: user_id,
        webinar_id: webinar_id
      })
    });
    
    return { success: true };
	},

  like: async ({ request }) => {
    const data = await request.formData();
    const likes = parseInt(data.get('like'), 10);
    const ID = data.get('comment-id');
    
    const response = await fetchJson(`${baseURL}avl_comments/${ID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        likes: likes + 1,
      })
    });
    
    return { success: true };
  }
};