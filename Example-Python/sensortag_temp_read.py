#
# Example script to show demonstrate the temperature sensor of the
# Sensortag CC2650
#
# 
#
##################################################

import datetime
import time
# pexpect lib to execute terminal commands
import pexpect 
import sys
import time

# Returns the float represented by a hexadecimal string
def floatfromhex(h):
    t = float.fromhex(h)
    if t > float.fromhex('7FFF'):
        t = -(float.fromhex('FFFF') - t)
        pass
    return t
bluetooth_adr = sys.argv[1]
print "Ensure the Sensortag is active and the green led is flashing every second."
time.sleep(5)
tool = pexpect.spawn('sudo gatttool -b ' + bluetooth_adr + ' --interactive')
time.sleep(1)
tool.expect('\[LE\]>')
print "Preparing to connect..."
tool.sendline('connect')
time.sleep(1)
tool.sendline('char-write-cmd 0x24 01')
time.sleep(1)
tool.expect('\[LE\]>')
while True:
	time.sleep(1)
	tool.sendline('char-read-hnd 0x21')
	time.sleep(1)
	tool.expect('descriptor: .*')

	# Converting sensor data output to celsius output for infrared and ambient temperature
	rval = tool.after.split()
	raw_ambient_temp = int( '0x'+ rval[4]+ rval[3], 16) # Choose ambient temperature (reverse bytes for little endian)
	ambient_temp_int = raw_ambient_temp >> 2 & 0x3FFF # Shift right, based on from TI
	ambient_temp_celsius = float(ambient_temp_int) * 0.03125 # Convert to Celsius based on info from TI
	raw_ir_temp = int( '0x'+ rval[2]+ rval[1], 16) # Choose ir temperature (reverse bytes for little endian)
	ir_temp_int = raw_ir_temp >> 2 & 0x3FFF # Shift right, based on from TI
	ir_temp_celsius = float(ir_temp_int) * 0.03125 # Convert to Celsius based on info from TI

        stringambT= str(ambient_temp_celsius)
	stringir= str(ir_temp_celsius)
	print ("Ambient temperature:" + stringambT + " Celsius")
	print ("IR temperature:" + stringir + " Celsius")

	
	
	


