FROM python:3.11

WORKDIR /backend

COPY . /backend/


RUN python -m pip install --upgrade pip
RUN apt-get update
RUN apt-get -y install libgl1-mesa-glx
RUN apt-get install ca-certificates curl gnupg

RUN distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
      && curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
      && curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | \
            sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
            tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

RUN pip install pipenv && pipenv install
RUN pip uninstall torch torchvision torchaudio
RUN pip3 install torch==2.0.0 torchvision==0.15.0 torchaudio --index-url https://download.pytorch.org/whl/cu118

ENTRYPOINT pipenv run python ./server/server.py