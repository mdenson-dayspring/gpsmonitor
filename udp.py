import socket
connection = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
try:
    connection.bind(('', 10110))
except socket.error:
    print( "connection failed" )
    connection.close()
    sys.exit()
while 1:
    data, addr = connection.recvfrom(1024)
    print( data )
