import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
  TableCaption,
} from "@/Components/ui/table";
import { Link } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { LogOut, MoveLeft } from "lucide-react";

const APW = () => {
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [showGclidOnly, setShowGclidOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await fetch(
          "https://webclicksees.onrender.com/api/tracking-records"
        );
        const data = await response.json();
        const domainRecords = data.filter(
          (record) =>
            record.domain === "the-academians.uk" ||
            record.domain === "www.the-academians.uk"
        );
        setRecords(domainRecords);
        setFilteredRecords(domainRecords);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tracking records:", error);
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, []);

  const handleFilter = () => {
    // if (!startDate && !endDate) {
    //   setFilteredRecords(records);
    //   return;
    // }

    let filtered = records;

    if (startDate || endDate) {
      const start = startDate
        ? new Date(startDate + "T00:00:00").getTime()
        : null;
      const end = endDate ? new Date(endDate + "T23:59:59").getTime() : null;

      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date).getTime();
        if (start && end) return recordDate >= start && recordDate <= end;
        if (start) return recordDate >= start;
        if (end) return recordDate <= end;
        return true;
      });
    }

    if (showGclidOnly) {
      filtered = filtered.filter((record) => record.gclid);
    }

    setFilteredRecords(filtered);
  };

  const toggleGclidFilter = () => {
    setShowGclidOnly(!showGclidOnly);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    try {
      if (confirmDelete) {
        const response = await fetch(
          `https://webclicksees.onrender.com/api/tracking-records/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          const updatedRecords = records.filter((record) => record._id !== id);
          setRecords(updatedRecords);
          setFilteredRecords(updatedRecords);
        }
      }
    } catch (error) {
      console.error("Error deleting tracking record:", error);
    }
  };

  useEffect(() => {
    handleFilter(); // Apply filters whenever filters change
  }, [startDate, endDate, showGclidOnly]);

  if (loading) {
    return <p>Loading tracking data...</p>;
  }

  // const handleFilter = () => {
  //   let filtered = records;

  //   if (startDate || endDate) {
  //     const start = startDate
  //       ? new Date(startDate + "T00:00:00").getTime()
  //       : null;
  //     const end = endDate ? new Date(endDate + "T23:59:59").getTime() : null;

  //     filtered = filtered.filter((record) => {
  //       const recordDate = new Date(record.date).getTime();
  //       if (start && end) return recordDate >= start && recordDate <= end;
  //       if (start) return recordDate >= start;
  //       if (end) return recordDate <= end;
  //       return true;
  //     });
  //   }

  //   if (showGclidOnly) {
  //     filtered = filtered.filter((record) => record.gclid);
  //   }

  //   // Set filtered records after filtering
  //   setFilteredRecords(filtered);
  // };

  // useEffect(() => {
  //   handleFilter(); // Apply filters whenever filters change
  // }, [startDate, endDate, showGclidOnly]);

  return (
    <div className="mt-12">
      <div className="flex items-start justify-around">
        <Link to={"/home"}>
          <Button className="py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            <MoveLeft size={20} /> Back
          </Button>
        </Link>

        <h1 className="text-center text-4xl font-bold pb-6">
          The-academians.uk(TA)
        </h1>

        <div>
          <Link to={"/login"}>
            <Button className="py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              <LogOut size={20} strokeWidth={2.25} />
              LogOut
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-4">
        <div className="flex md:flex-row flex-col items-center justify-center md:space-x-4">
          <div>
            <label className=" mb-2">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full  px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="mb-4">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className=" w-full px-3 py-2 border rounded"
            />
          </div>

          <button
            onClick={toggleGclidFilter}
            className="px-4 py-2 mt-6 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {showGclidOnly ? "Show All" : "Paid Click"}
          </button>
        </div>
      </div>
      <Table className="max-w-4xl mx-auto">
        <TableCaption>A list of your recent Tracking.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Domain</TableHead>
            <TableHead>Gclid</TableHead>
            <TableHead>Ip</TableHead>
            <TableHead className="text-left">Country</TableHead>
            <TableHead className="text-left">VPN</TableHead>
            <TableHead className="text-left">KW</TableHead>
            <TableHead className="text-left">GAD</TableHead>
            <TableHead className="text-left">Date & Time</TableHead>
            <TableHead className="text-left">Delete</TableHead>
          </TableRow>
        </TableHeader>

        {/* <TableBody>
          {filteredRecords
            .slice()
            .reverse()
            .map((record) => {
              // Format the date and time using 'toLocaleString'
              const formattedDateTime = record.date
                ? new Date(record.date).toLocaleString() // Includes both date and time
                : "N/A";

              return (
                <TableRow key={record._id}>
                  <TableCell className="font-medium">{record.domain}</TableCell>
                  <TableCell className="max-w-[150px] overflow-auto break-words whitespace-nowrap">
                    {record.gclid || "N/A"}
                  </TableCell>
                  <TableCell>{record.ip}</TableCell>
                  <TableCell className="text-left">{record.country}</TableCell>
                  <TableCell className="text-left">
                    {record.isVpn ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>{record.kw || "N/A"}</TableCell>
                  <TableCell>{record.gad || "N/A"}</TableCell>
                  <TableCell>{formattedDateTime}</TableCell>

                  <TableCell className="text-left">
                    <button
                      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleDelete(record._id)}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody> */}

        {/* correct Code  */}
        {/* <TableBody>
          {(() => {
            const ipRecords = {};
            const uniqueRecords = [];

            filteredRecords
              .slice()
              .reverse()
              .forEach((record) => {
                if (record.ip) {
                  if (!ipRecords[record.ip]) {
                    ipRecords[record.ip] = {
                      ...record,
                      visitCount: 1,
                      gclidList: record.gclid ? [record.gclid] : [],
                      gclidCount: record.gclid ? 1 : 0,
                    };
                    uniqueRecords.push(ipRecords[record.ip]);
                  } else {
                    ipRecords[record.ip].visitCount += 1;

                    if (record.gclid) {
                      ipRecords[record.ip].gclidList.push(record.gclid);
                      ipRecords[record.ip].gclidCount += 1;
                    }
                  }
                }
              });

            return uniqueRecords.map((record) => {
              const formattedDateTime = record.date
                ? new Date(record.date).toLocaleString()
                : "N/A";

              return (
                <TableRow key={record._id}>
                  <TableCell className="font-medium">{record.domain}</TableCell>

                  <TableCell className="max-w-[150px] overflow-auto break-words whitespace-nowrap pt-8">
                    {record.gclidList.length > 0 ? (
                      <div className="relative group inline-block">
                        <span className="cursor-pointer">
                          {record.gclidList.join(", ")}
                        </span>
                        <div className="absolute  bottom-full  group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded max-w-[200px] overflow-auto">
                          Total GCLIDs: {record.gclidCount}
                        </div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>

                  <TableCell>
                    {record.ip ? (
                      <div className="relative group inline-block">
                        <span className="cursor-pointer">{record.ip}</span>
                        <div className="absolute bottom-full mb-1 group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          <div>Total Visits: {record.visitCount}</div>
                        </div>
                        <div className="absolute hidden bottom-full mb-1 group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          <div>With GCLID: {record.gclidCount}</div>
                          <div>
                            Without GCLID:{" "}
                            {record.visitCount - record.gclidCount}
                          </div>
                        </div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>

                  <TableCell className="text-left">{record.country}</TableCell>
                  <TableCell className="text-left">
                    {record.isVpn ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>{record.kw || "N/A"}</TableCell>
                  <TableCell>{record.gad || "N/A"}</TableCell>
                  <TableCell>{formattedDateTime}</TableCell>
                  <TableCell className="text-left">
                    <button
                      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleDelete(record._id)}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              );
            });
          })()}
        </TableBody> */}

        <TableBody>
          {(() => {
            const ipRecords = {};
            const uniqueRecords = [];

            filteredRecords
              .slice()
              .reverse()
              .forEach((record) => {
                if (record.ip) {
                  if (!ipRecords[record.ip]) {
                    ipRecords[record.ip] = {
                      ...record,
                      visitCount: 1,
                      gclidList: record.gclid ? [record.gclid] : [],
                    };
                    uniqueRecords.push(ipRecords[record.ip]);
                  } else {
                    ipRecords[record.ip].visitCount += 1;

                    if (record.gclid) {
                      ipRecords[record.ip].gclidList.push(record.gclid);
                    }
                  }
                }
              });

            return uniqueRecords.map((record) => {
              const formattedDateTime = record.date
                ? new Date(record.date).toLocaleString()
                : "N/A";

              // Count unique and duplicate GCLIDs
              const gclidCountMap = {};
              record.gclidList.forEach((gclid) => {
                gclidCountMap[gclid] = (gclidCountMap[gclid] || 0) + 1;
              });

              const uniqueGclids = Object.keys(gclidCountMap).length;
              const duplicateGclids = Object.values(gclidCountMap)
                .filter((count) => count > 1) // Find values occurring more than once
                .reduce((acc, count) => acc + (count - 1), 0); // Sum up extra occurrences
              const totalGclids = record.gclidList.length;

              
              return (
                <TableRow key={record._id}>
                  <TableCell className="font-medium">{record.domain}</TableCell>

                  {/* GCLID Column with Tooltip */}
                  <TableCell className="max-w-[150px] overflow-auto break-words whitespace-nowrap pt-12">
                    {record.gclidList.length > 0 ? (
                      <div className="relative group inline-block">
                        <span className="cursor-pointer">
                          {record.gclidList.join(", ")}
                        </span>
                        <div className="absolute bottom-full group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded max-w-[200px]">
                          <div>Total: {totalGclids}</div>
                        </div>

                        <div className="absolute bottom-full hidden group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded max-w-[200px]">
                          <div>Unique: {uniqueGclids}</div>
                          <div>Duplicate: {duplicateGclids}</div>
                        </div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>

                  <TableCell>
                    {record.ip ? (
                      <div className="relative group inline-block">
                        <span className="cursor-pointer">{record.ip}</span>
                        <div className="absolute bottom-full mb-1 group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          <div>Total Visits: {record.visitCount}</div>
                        </div>
                        <div className="absolute hidden bottom-full mb-1 group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          <div>With GCLID: {totalGclids}</div>
                          <div>
                            Without GCLID: {record.visitCount - totalGclids}
                          </div>
                        </div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>

                  <TableCell className="text-left">{record.country}</TableCell>
                  <TableCell className="text-left">
                    {record.isVpn ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>{record.kw || "N/A"}</TableCell>
                  <TableCell>{record.gad || "N/A"}</TableCell>
                  <TableCell>{formattedDateTime}</TableCell>
                  <TableCell className="text-left">
                    <button
                      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleDelete(record._id)}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              );
            });
          })()}
        </TableBody>
      </Table>
    </div>
  );
};

export default APW;
