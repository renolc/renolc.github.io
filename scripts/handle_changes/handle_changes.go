package main

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
	"time"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func main() {
	handleAddedFiles(strings.Split(os.Args[1], " "))
	handleModifiedFiles(strings.Split(os.Args[2], " "))
	handleDeletedFiles(strings.Split(os.Args[3], " "))

	compilePage("raw", "index")
}

// handlers

func handleAddedFiles(allAdded []string) {
	for _, added := range allAdded {
		if added == "" {
			continue
		}
		path, file := getPathAndFile(added)
		println("added", path, file)
		addPage(path, file)
		println("---")
	}
}

func handleModifiedFiles(allModified []string) {
	for _, modified := range allModified {
		if modified == "" {
			continue
		}
		path, file := getPathAndFile(modified)
		println("modified", path, file)
		compilePage(path, file)
		println("---")
	}
}

func handleDeletedFiles(allDeleted []string) {
	for _, deleted := range allDeleted {
		if deleted == "" {
			continue
		}
		path, file := getPathAndFile(deleted)
		println("deleted", path, file)
		deletePage(path, file)
		println("---")
	}
}

// add

func addPage(path, file string) {
	compilePage(path, file)

	if isAPost(path) {
		addToIndex(path, file, time.Now().Format("Mon Jan 2 2006"))
		addToRss(path, file)
	}
}

func addToIndex(path, file, date string) {
	println("adding", file, "to index")
	link := getIndexTableLink(path, file)
	line := fmt.Sprintf("| %s %s", date, link)
	insertLineIntoFile(line, "raw/index.md", 2)
}

func addToRss(path, file string) {
	println("adding", file, "to rss")
	title := getTitleFromFile(file)
	description, err := os.ReadFile(fmt.Sprintf("docs%s/%s.html", path[3:], file))
	if err != nil {
		panic(err)
	}

	// truncate description to only the content between the <body> and </body> tags
	description = []byte(strings.Split(string(description), "<body>")[1])
	description = []byte(strings.Split(string(description), "</body>")[0])

	// make the description a single line
	description = []byte(strings.ReplaceAll(string(description), "\n", ""))

	item := fmt.Sprintf("<item><title>%s</title>%s<description><![CDATA[%s]]></description></item>", title, getRssLinkTag(path, file), description)

	insertLineIntoFile(item, "docs/rss.xml", 5)
}

func insertLineIntoFile(line, file string, index int) {
	content, err := os.ReadFile(file)
	if err != nil {
		panic(err)
	}

	lines := strings.Split(string(content), "\n")
	lines = append(lines, "")
	copy(lines[index+1:], lines[index:])
	lines[index] = line

	content = []byte(strings.Join(lines, "\n"))

	err = os.WriteFile(file, content, 0777)
	if err != nil {
		panic(err)
	}
}

// delete

func deletePage(path string, file string) {
	html_path := getHtmlPath(path, file)
	println("deleting", html_path)
	err := os.Remove(html_path)
	if err != nil {
		panic(err)
	}

	if isAPost(path) {
		deleteLineFromFile(getIndexTableLink(path, file), "raw/index.md")
		deleteLineFromFile(getRssLinkTag(path, file), "docs/rss.xml")
	}
}

func deleteLineFromFile(line, file string) {
	println("deleting", line, "from", file)

	content, err := os.ReadFile(file)
	if err != nil {
		panic(err)
	}

	lines := strings.Split(string(content), "\n")
	newLines := []string{}

	for _, l := range lines {
		if !strings.Contains(l, line) {
			newLines = append(newLines, l)
		}
	}

	err = os.WriteFile(file, []byte(strings.Join(newLines, "\n")), 0777)
	if err != nil {
		panic(err)
	}
}

// utils

func compilePage(path, file string) {
	println("compiling", file)
	md_path := fmt.Sprintf("%s/%s.md", path, file)
	html_path := getHtmlPath(path, file)
	cmd := exec.Command("pandoc", md_path, "--template", "templates/html.template", "-f", "gfm+hard_line_breaks", "-s", "-o", html_path)
	if err := cmd.Run(); err != nil {
		panic(err)
	}
}

func isAPost(path string) bool {
	return strings.HasPrefix(path, "raw/posts")
}

func getIndexTableLink(path, file string) string {
	link := fmt.Sprintf("%s/%s", path[3:], file)
	return fmt.Sprintf("| [%s](%s) |", getTitleFromFile(file), link)
}

func getTitleFromFile(file string) string {
	return cases.Title(language.English).String(strings.Join(strings.Split(file, "-"), " "))
}

func getHtmlPath(path, file string) string {
	return fmt.Sprintf("docs%s/%s.html", path[3:], file)
}

func getPathAndFile(f string) (path, file string) {
	split := strings.Split(f, "/")
	lastIndex := len(split) - 1
	path = strings.Join(split[:lastIndex], "/")
	file = strings.Split(split[lastIndex], ".")[0]
	return
}

func getRssLinkTag(path, file string) string {
	link := fmt.Sprintf("https://phillipgibson.me%s/%s", path[3:], file)
	return fmt.Sprintf("<link>%s</link>", link)
}
