Feature: Sports files

	Scenario: Upload, filter, preview, download, and delete files
		Given the Club Admin is signed in to Sports
		When the Club Admin opens Files from the sidebar
		And the Club Admin uploads a file
		Then the uploaded file is displayed in the Files page
		And files can be filtered by Training, Documents, Media, and Finance
		When the Club Admin previews and deletes the uploaded file
		Then the uploaded file is removed from the Files page
		When the Club Admin opens another file's details
		And downloads the file and opens its full page
		Then the Club Admin can return to the Files page
