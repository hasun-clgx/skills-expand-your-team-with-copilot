window.activitySharing = {
  createControls(name, schedule) {
    const url = new URL(window.location.pathname, window.location.origin);
    url.searchParams.set("activity", name);
    const text = `Join me for ${name} at Mergington High School! ${schedule}`;
    const controls = document.createElement("div");
    controls.className = "activity-sharing";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", `Share ${name}`);

    const label = document.createElement("span");
    label.className = "share-label";
    label.textContent = "Share activity:";
    controls.appendChild(label);

    const links = [
      ["WhatsApp", `https://wa.me/?text=${encodeURIComponent(`${text}\n${url.href}`)}`],
      ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url.href)}`],
    ];

    links.forEach(([platform, href]) => {
      const link = document.createElement("a");
      link.className = "share-button";
      link.textContent = platform;
      link.setAttribute("aria-label", `Share ${name} on ${platform} (opens in a new tab)`);
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      controls.appendChild(link);
    });

    const status = document.createElement("p");
    status.className = "share-status";
    status.setAttribute("role", "status");

    const manualCopy = document.createElement("input");
    manualCopy.type = "text";
    manualCopy.readOnly = true;
    manualCopy.value = url.href;
    manualCopy.className = "share-link-input hidden";
    manualCopy.setAttribute("aria-label", `Link to ${name}`);

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "share-button";
    copyButton.textContent = "Copy link";
    copyButton.setAttribute("aria-label", `Copy link to ${name}`);
    copyButton.addEventListener("click", async () => {
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
          throw new Error("Clipboard access is unavailable");
        }
        await navigator.clipboard.writeText(url.href);
        manualCopy.classList.add("hidden");
        status.textContent = "Activity link copied!";
      } catch (error) {
        console.error("Could not copy activity link:", error);
        manualCopy.classList.remove("hidden");
        manualCopy.focus();
        manualCopy.select();
        status.textContent = "Automatic copying is unavailable. Copy the selected link to share it.";
      }
    });
    controls.appendChild(copyButton);

    if (navigator.share) {
      const shareButton = document.createElement("button");
      shareButton.type = "button";
      shareButton.className = "share-button";
      shareButton.textContent = "More options";
      shareButton.setAttribute("aria-label", `More sharing options for ${name}`);
      shareButton.addEventListener("click", async () => {
        try {
          await navigator.share({
            title: `${name} - Mergington High School`,
            text,
            url: url.href,
          });
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Could not share activity:", error);
            status.textContent = "Sharing is unavailable. Try Copy link instead.";
          }
        }
      });
      controls.appendChild(shareButton);
    }

    controls.append(manualCopy, status);
    return controls;
  },
};
