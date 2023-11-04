import java.io.*;
import java.util.Scanner;

public class FromTxtToJson {
    public static void main(String[] args) throws IOException {
        final String inputFilePath = "C:\\Users\\JohnA\\Desktop\\Offences2.txt";
        final String outputFilePath = "C:\\Users\\JohnA\\Desktop\\Json.txt";
        File file = new File(inputFilePath);
        Scanner inputFile = new Scanner(file);
        PrintWriter outputFile = new PrintWriter(outputFilePath);
        String row;
        String[] arrayRow;
        String Json = "{ \"offences\":[";
        int recordsProcessed=0;
        while (inputFile.hasNext()) {
            row = inputFile.nextLine();
            arrayRow = row.split("\t");
            Json += "{\"item\":" + "\"" + arrayRow[0] + "\", " +
                    "\"offence\":" + "\"" + arrayRow[1].replaceAll("\"", "\0") + "\", " +
                    "\"section\":" + "\"" + arrayRow[2] + "\", " +
                    "\"fine\":" + "\"" + arrayRow[3].strip() + "\"}" + (inputFile.hasNext() ? "," : "");
            recordsProcessed++;
        }
        Json += "]}";
        System.out.println("Records Processed: " + recordsProcessed);

        outputFile.println(Json);
        outputFile.close();
        inputFile.close();

    }
}
