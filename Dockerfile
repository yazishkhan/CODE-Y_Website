FROM python:3

WORKDIR app

COPY . . 

ENV JUDGE0_API_KEY=fd3b5aec77mshedd19b84405710ep190c92jsn3f4bc9d0ff26

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python3","aap.py"]
 
