export default function UploadCard({
                                       file,
                                       setFile,
                                       uploadResume
                                   }) {
    return (
        <div className="upload-card">

            <h1>Prepare For Your Next Interview</h1>

            <p>
                Upload your resume and start
                an AI powered mock interview.
            </p>

            <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                    setFile(e.target.files[0])
                }
            />

            <button onClick={uploadResume}>
                Upload Resume
            </button>

        </div>
    );
}