export default async function({ id }) {
    const url = new URL(`https://www.redgifs.com/watch/${id}`);

    const html = await fetch(url)
    .then(r => r.text())
    .catch(() => {});

    if (!html) {
        return { error: "fetch.fail" }
    }

    if (!(html.includes("<script type='application/ld+json'>"))) {
        return { error: "fetch.empty" };
    }

    const streamData = JSON.parse(
        html.split("<script type='application/ld+json'>")[1].split('</script>')[0]
    );

    const id_cased = streamData.video.contentUrl.split("/").pop().split(".")[0];	

    return {
        urls: streamData.video.contentUrl,
        filenameAttributes: {
            service: 'redgifs',
            id: id_cased,
            title: id_cased,
            author: streamData.video.author,
            resolution: `${streamData.video.width}x${streamData.video.height}`,
            qualityLabel: `${streamData.video.height}p`,
            extension: 'mp4'
        },
        fileMetadata: {
            title: id_cased,
            artist: streamData.video.author,
        }
    }
}