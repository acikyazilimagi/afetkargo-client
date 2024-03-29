import { useState, useEffect, useRef, useMemo } from "react";
import "../../../src/index.css";

import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import "leaflet/dist/leaflet.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import getRecieverInfosRequest from "../../api/getRecieverInfos";
import getDriverLocationInfoRequest from "../../api/getDriverLocationInfo";
import { useNavigate } from "react-router-dom";

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const Delivery = () => {
  const [age, setAge] = useState("");
  const [cargoId, setCargoId] = useState("");
  const [defaultCenter, setDefaultCenter] = useState([]);
  const [receiverInfos, setReceiverInfos] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const parsedAliciInfo = JSON.parse(
      localStorage.getItem("afetkargo_alici_info")
    );

    setTimeout(() => {
      const data = {
        receiverPassword: parsedAliciInfo.receiverPassword,
        plateNo: parsedAliciInfo.plateNo,
      };

      getReceiverData(data);
    }, 500);
  }, []);

  useEffect(() => {
    window.setInterval(() => {
      getDriverLocationInfo(cargoId);
    }, 1000 * 60 * 15);
  }, []);

  const getReceiverData = async (data) => {
    const response = await getRecieverInfosRequest(data);

    setReceiverInfos(response.data);
    setCargoId(response.data.id);

    setDefaultCenter([response.data.lat, response.data.long]);
    getDriverLocationInfo(response.data.id);
  };

  const getDriverLocationInfo = async (cargoId) => {
    const response = await getDriverLocationInfoRequest(cargoId);
    if (response.code === 200) {
      setDefaultCenter([response.data.lat, response.data.long]);
    }
  };

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <>
      {receiverInfos && (
        <Grid
          container
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            padding: "24px",
          }}
        >
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">afetkargo | Lojistik Teslim</Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Typography variant="h8">{"#12345678"}</Typography>
              {/* <Typography variant="h8">Durumu:</Typography> */}
            </div>
          </Grid>

          <Divider />

          <Grid item xs={12}>
            <Typography variant="h6">Başlangıç Adresi</Typography>
          </Grid>

          <Grid item xs={12}>
            <MapContainer
              center={defaultCenter}
              zoom={15}
              scrollWheelZoom={false}
              style={{
                width: "100%",
                height: "400px"
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                id="marker-wrapper"
                draggable={true}
                position={defaultCenter}
              >
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </Grid>

          <Divider />
          <Grid item xs={12}>
            <TextField
              value={receiverInfos.plateNo}
              id="plateno"
              label="Plaka No"
              variant="outlined"
              fullWidth
              disabled={true}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              value={receiverInfos.driverFullname}
              id="driverFullname"
              label="Sürücü Adı Soyadı"
              variant="outlined"
              fullWidth
              disabled={true}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              value={receiverInfos.driverPhone}
              id="driverPhone"
              label="Sürücü Telefon No"
              variant="outlined"
              fullWidth
              disabled={true}
            />
          </Grid>

          <Grid item xs={12}>
            <Link
              href="https://www.google.com/maps/place/Crystal+Admiral+Resort+Suites+%26+SPA/@36.6949113,31.6098093,13.75z/data=!4m8!3m7!1s0x14c3536c30bc9b99:0x5cbeef369867e031!5m2!4m1!1i2!8m2!3d36.6950891!4d31.5976238"
              color="inherit"
              target={"_blank"}
            >
              Başlangıç Adresini Haritada Göster
            </Link>
          </Grid>

          <Grid item xs={12}>
            <TextField
              value={receiverInfos.inventory}
              id="inventory"
              label="Envanterler"
              variant="outlined"
              fullWidth
              multiline={true}
              rows={5}
              disabled={true}
            />
          </Grid>
          <Divider />

          {/* <Grid item xs={12}>
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
                      Adresi
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {receiverInfos.receiverList &&
                    receiverInfos?.receiverList.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.deliveryFullname}
                        </TableCell>
                        <TableCell align="center">
                          {row.deliveryPhone}
                        </TableCell>
                        <TableCell align="right">{row.address}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Divider /> */}

          <Grid
            item
            xs={12}
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <Typography variant="h6">Teslimat Durumu</Typography>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Durumu</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={10}>Teslim alındı, envanter tam.</MenuItem>
                <MenuItem value={20}>Teslim alındı, envanter eksik.</MenuItem>
                <MenuItem value={30}>Teslim alınmadı.</MenuItem>
              </Select>
            </FormControl>

            <TextField
              id="deliveryNote"
              label="Teslim Açıklaması"
              variant="outlined"
              multiline={true}
              rows={3}
              fullWidth
            />

            <Button variant="contained">Teslimatı Bildir</Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Geri Dön
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Delivery;
