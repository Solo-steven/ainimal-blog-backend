all:
	docker-compose up -d --build
clean:
	docker-compose down