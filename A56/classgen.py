file1 = open("items.txt","r+")



print("Output of Read function is ")
print("const offences = [")
for line in file1:
    a = line.split("?")
    print("{\"item\": \"" + a[0].strip() + "\", \"offense\": \"" + a[1].strip() + "\", "+ "\"section\": \"" + a[2].strip() + "\", \"fine\": \"" +
        a[3].strip() + "\", \"schedule\": \"" + a[4].strip() + "\"},")

print("];")
file1.close()