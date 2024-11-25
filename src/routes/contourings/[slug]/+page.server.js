import fetchJson from "$lib/fetch-json"

const baseURL = 'https://fdnd-agency.directus.app/items/'

export async function load({params}) {
  const contouringURL = `${baseURL}avl_contourings?fields=*.*.*&filter[slug][_eq]=${params.slug}`
  const contouring = await fetchJson(contouringURL)

  const commentsURL = `${baseURL}avl_comments?fields=*.*.*.*&filter[contouring_id][_eq]=${contouring.data[0].id}`  
  const comments = await fetchJson(commentsURL)
  
  return {
    contouring: contouring.data[0],
    comments: comments.data
  }
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
  comment: async ({ request, params }) => {
		const data = await request.formData();
    const timestamp = new Date().toISOString();
    const content = data.get('comment');

    const contouringData = await fetchJson(`${baseURL}avl_contourings?fields=id&filter[slug][_eq]=${params.slug}`)

    const user_id = 1;
    const contouring_id = contouringData.data[0].id;

    const response = await fetchJson(`${baseURL}avl_comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        time_posted: timestamp,
        content: content,
        user_id: user_id,
        contouring_id: contouring_id
      })
    });
    
    return { success: true };
	}
}