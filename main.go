package main

import (
	"embed"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"
)

//go:embed app
var res embed.FS

type Domain struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Domains map[int]Domain

type Server struct {
	ID      int
	Domains Domains
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if strings.HasPrefix(r.URL.Path, "/app/") {
		file := http.FileServer(http.FS(res))
		file.ServeHTTP(w, r)
		return
	} else if strings.HasPrefix(r.URL.Path, "/cc/api-domains/") {
		if r.Method == http.MethodDelete {
			parts := strings.Split(r.URL.Path, "/")
			id, err := strconv.Atoi(parts[3])
			if err != nil {
				panic(err)
			}
			delete(s.Domains, id)
			w.WriteHeader(http.StatusOK)
		}
	} else if strings.HasPrefix(r.URL.Path, "/cc/api-domains") {
		if r.Method == http.MethodGet {
			domains := make([]Domain, len(s.Domains))
			index := 0
			for _, value := range s.Domains {
				domains[index] = value
				index++
			}
			data, err := json.Marshal(domains)
			if err != nil {
				panic(err)
			}
			_, err = w.Write(data)
			if err != nil {
				panic(err)
			}
		} else if r.Method == http.MethodPost {
			var data map[string]interface{}
			body, err := ioutil.ReadAll(r.Body)
			defer r.Body.Close()
			if err != nil {
				panic(err)
			}
			err = json.Unmarshal(body, &data)
			if err != nil {
				panic(err)
			}
			domain := Domain{
				ID:   s.ID,
				Name: data["name"].(string),
			}
			s.Domains[s.ID] = domain
			s.ID++
			output, err := json.Marshal(domain)
			if err != nil {
				panic(err)
			}
			_, err = w.Write(output)
			if err != nil {
				panic(err)
			}
		}
	}
	return
}

func main() {
	contents, err := ioutil.ReadFile("mashery_local.json")
	if err != nil {
		panic(err)
	}

	var s map[string]interface{}
	err = json.Unmarshal(contents, &s)
	if err != nil {
		panic(err)
	}

	//fmt.Println(s)

	domains := Domains{
		1: {1, "example.com"},
		2: {2, "test.com"},
	}
	server := Server{
		ID:      3,
		Domains: domains,
	}
	http.Handle("/", &server)
	log.Println("server started...")
	err = http.ListenAndServe(":8088", nil)
	if err != nil {
		panic(err)
	}
}
