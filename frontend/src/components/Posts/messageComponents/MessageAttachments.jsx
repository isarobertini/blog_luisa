import React from "react";

export default function MessageAttachments({ attachments }) {
    return (
        <>
            {attachments?.map((att) =>
                att.type === "image" ? (
                    <img key={att.url} src={att.url} alt="" width={200} />
                ) : att.type === "video" ? (
                    <video key={att.url} src={att.url} controls width={200} />
                ) : att.type === "audio" ? (
                    <audio key={att.url} src={att.url} controls />
                ) : null
            )}
        </>
    );
}
