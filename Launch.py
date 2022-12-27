import os, urllib.request, datetime, time

command = "node ."

# Returns true if connected to the internet
def connected():
	try:
		urllib.request.urlopen("http://www.google.ca")
		return True
	except:
		return False
		
while (True):
	os.system(command)
	now = datetime.datetime.now()
	
	# Host is disconnected from the internet, retry in 10 mins
	if (not connected()):
		print("Disconnect occured at " + str(now))
		time.sleep(600)
		
	# Error has occured, restart immediately
	else:
		print("An error occured at " + str(now))
