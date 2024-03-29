import { Button, Divider, Grid, Link, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GeoLocation from "../GeoLocation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import startTransferRequest from "../../api/startTransfer";

function createData(
  deliveryFullname,
  deliveryPhone,
  address,
  deliveryGoogleMapsLink
) {
  return { deliveryFullname, deliveryPhone, address, deliveryGoogleMapsLink };
}

const Monitoring = () => {
  const navigate = useNavigate();
  const [senderData, setSenderData] = useState({
    code: "",
    plateNo: "",
    driverFullname: "",
    driverPhone: "",
    inventory: "",
    startAddressAddress: "",
    long: "",
    lat: "",
    googleMapsLink: "",
    endAddressList: [
      {
        deliveryFullname: "",
        deliveryPhone: "",
        address: "",
        deliveryLong: "",
        deliveryLat: "",
        deliveryGoogleMapsLink: "",
      },
    ],
    partialcount: 0,
  });

  const [deliveryRows, setDeliveryRows] = useState([]);

  const [isDriverOnRoad, setIsDriverOnRoad] = useState(false);
  const [driverInfo, setDriverInfo] = useState();
  const [driverCredentials, setDriverCredentials] = useState();

  function generateMapLink(lat, lng) {
    return `https://maps.google.com/?q=${lat},${lng}`;
  }

  useEffect(() => {
    let driverInfoData = JSON.parse(localStorage.getItem("afetkargo_surucu"));
    const driverCredentialsData = JSON.parse(localStorage.getItem("afetkargo_surucu_info"));
    
    setDriverInfo(driverInfoData);
    setDriverCredentials(driverCredentialsData);
    setDeliveryRows(driverInfoData?.receiverList ?? []);
  }, []);

  useEffect(() => {
    if (driverInfo && driverCredentials && driverInfo?.status === 2){
      setIsDriverOnRoad(true);
      driverOnRoad();
    }
  }, [driverInfo, driverCredentials])

  const driverOnRoad = () => {
    setIsDriverOnRoad(true);
    const data = {
      "driverPassword": driverCredentials.driverPassword,
      "plateNo": driverInfo.plateNo,
      "cargoId": driverInfo.id
    };
    const response = startTransferRequest(data);
    console.log("response", response)
  };

  return (
    <Grid
      container
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "24px",
      }}
    >
      <GeoLocation
        isDriverOnRoad={isDriverOnRoad}
        driverOnRoad={driverOnRoad}
      />
      <Grid item xs={12}>
        <Typography variant="h4">afetkargo | Lojistik İzleme</Typography>
      </Grid>

      <Divider />

      <Grid item xs={12}>
        <Typography variant="h6">{driverInfo?.originAddress}</Typography>
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "700" }}>
                  Alıcı Ad Soyad
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "700" }}>
                  Telefon No
                </TableCell>
                <TableCell align="right" style={{ fontWeight: "700" }}>
                  Adres
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveryRows && deliveryRows.length ? (
                deliveryRows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.receiverFullname}
                    </TableCell>
                    <TableCell align="center">{row.receiverPhone}</TableCell>
                    <TableCell align="right">
                      <Link
                        href={generateMapLink(
                          row.destinationLat,
                          row.destinationLong
                        )}
                        underline="none"
                        target="_blank"
                      >
                        Google Haritada Göster
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid display={"flex"} justifyContent={"end"}>
        {(isDriverOnRoad || driverInfo?.status === 2) && <span>Konum bilgileriniz alınmıştır.</span>}
      </Grid>
      <Grid
        item
        xs={12}
        style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
      >
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Geri Dön
        </Button>

        {(!isDriverOnRoad && driverInfo?.status === 1) && (
          <Button variant="contained" onClick={driverOnRoad}>
            Yola çıktım
          </Button>
        )}

        <Button
          variant="contained"
          style={{ backgroundColor: "green" }}
          onClick={() => navigate("/teslim")}
        >
          Teslim Ettim
        </Button>
      </Grid>
    </Grid>
  );
};

export default Monitoring;
