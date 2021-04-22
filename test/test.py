import os
import platform

_file = open('variables.js', "w")

# s = 'e'
username = str(input("Enter username:"))


_file.write("""
const env = {
  name: 'Aldhanekaa',
  username: 'aldhan',
  email: 'aldhaneka@gmail.com',
  password: 'aldhan',
};

export { env };
""".strip())