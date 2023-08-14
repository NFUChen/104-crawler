from server import sio, app

if __name__ == "__main__":
    sio.run(app,host="0.0.0.0", debug= False, port= 8080)