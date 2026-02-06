import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { updateTrip, getTripById } from "../../../services/TripService/TripService";
import { getRouteDropdown } from "../../../services/RouteService/RouteService";
import { getAllVehicle } from "../../../services/VehicleService/VehicleService";
import { getAllDriver } from "../../../services/driverService/driverService";
import {
  getVehicleCurrentDriver,
  getcurrentDriverVehicle,
} from "../../../services/vehicleDriverAssigmentService/vehicleDriverService";
import { getJobDropdown } from "../../../services/jobService/JobService";

/* ===================== SELECT STYLES ===================== */

const selectStyles = {
  control: (base) => ({
    ...base,
    minHeight: 38,
    borderRadius: 8,
    borderColor: "var(--color-fleet-border)",
    boxShadow: "none",
  }),
};

/* ===================== COMPONENT ===================== */

const UpdateTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [isRouteLocked, setIsRouteLocked] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedPrimaryDriver, setSelectedPrimaryDriver] = useState(null);
  const [selectedSecondaryDriver, setSelectedSecondaryDriver] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const [form, setForm] = useState({
    job_id: null,
    vehicle_id: null,
    primary_driver_id: null,
    secondary_driver_id: null,
    route_id: null,
    route_summary: "",
    total_distance_km: "",
    expected_delivery_date: "",
  });

  /* ===================== LOAD DATA ===================== */

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          vehicleRes,
          driverRes,
          routeRes,
          jobRes,
          tripRes,
        ] = await Promise.all([
          getAllVehicle({ page: 1 }),
          getAllDriver(),
          getRouteDropdown(),
          getJobDropdown(),
          getTripById(id),
        ]);

        setVehicles(vehicleRes?.data || []);
        setDrivers(driverRes?.data || []);
        setRoutes(routeRes?.data || []);
        setJobs(jobRes?.data || []);

        const trip = tripRes?.data;
        if (!trip) return;

        /* -------- JOB -------- */
        if (trip.job) {
          const jobOption = {
            value: trip.job.id,
            label: `${trip.job.customer?.party_name} • ${trip.job.pickup_location} → ${trip.job.dropoff_location}`,
            route: trip.job.route,
          };
          setSelectedJob(jobOption);
          setForm(prev => ({ ...prev, job_id: trip.job.id }));
        }

        /* -------- VEHICLE -------- */
        if (trip.vehicle) {
          const vehicleOption = {
            value: trip.vehicle.id,
            label: trip.vehicle.vehicle_number,
          };
          setSelectedVehicle(vehicleOption);
          setForm(prev => ({ ...prev, vehicle_id: trip.vehicle.id }));
        }

        /* -------- PRIMARY DRIVER -------- */
        if (trip.primaryDriver) {
          const driverOption = {
            value: trip.primaryDriver.id,
            label: trip.primaryDriver.name,
          };
          setSelectedPrimaryDriver(driverOption);
          setForm(prev => ({ ...prev, primary_driver_id: trip.primaryDriver.id }));
        }

        /* -------- SECONDARY DRIVER -------- */
        if (trip.secondaryDriver) {
          const secondaryOption = {
            value: trip.secondaryDriver.id,
            label: trip.secondaryDriver.name,
          };
          setSelectedSecondaryDriver(secondaryOption);
          setForm(prev => ({ ...prev, secondary_driver_id: trip.secondaryDriver.id }));
        }

        /* -------- ROUTE -------- */
        if (trip.route) {
          const fullRoute = routes.find(r => r.id === e.route.id);

          if (fullRoute) {
            const routeOption = {
              value: fullRoute.id,
              label: `${fullRoute.source_city} → ${fullRoute.destination_city}`,
              distance: fullRoute.distance_km,
            };

            setSelectedRoute(routeOption);
            setIsRouteLocked(true);

            setForm(prev => ({
              ...prev,
              route_id: fullRoute.id,
              route_summary: routeOption.label,
              total_distance_km: fullRoute.distance_km,
            }));
          }


          setSelectedRoute(routeOption);
          setIsRouteLocked(!!trip.job?.route);

          setForm(prev => ({
            ...prev,
            route_id: trip.route.id,
            route_summary: routeOption.label,
            total_distance_km: trip.route.distance_km,
          }));
        }

        /* -------- DATE -------- */
        setForm(prev => ({
          ...prev,
          expected_delivery_date: trip.expected_delivery_date?.split("T")[0],
        }));

      } catch (err) {
        toast.error("Failed to load trip data");
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadData();
  }, [id]);

  /* ===================== SUBMIT ===================== */

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateTrip(form, id);
      toast.success("Trip updated successfully");
      navigate("/trips");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen bg-fleet-bg p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Update Trip</h1>

      <div className="bg-fleet-card rounded-xl border shadow-sm">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* JOB */}
          <div>
            <label className="label">Job</label>
            <Select
              styles={selectStyles}
              value={selectedJob}
              placeholder="Select job"
              options={jobs.map(j => ({
                value: j.id,
                label: `${j.customer?.party_name} • ${j.pickup_location} → ${j.dropoff_location}`,
                route: j.route,
              }))}
              onChange={(e) => {
                setSelectedJob(e);
                setForm(prev => ({ ...prev, job_id: e?.value }));

                if (e?.route) {
                  const fullRoute = routes.find(r => r.id === e.route.id);

                  if (fullRoute) {
                    const routeOption = {
                      value: fullRoute.id,
                      label: `${fullRoute.source_city} → ${fullRoute.destination_city}`,
                      distance: fullRoute.distance_km,
                    };

                    setSelectedRoute(routeOption);
                    setIsRouteLocked(true);

                    setForm(prev => ({
                      ...prev,
                      route_id: fullRoute.id,
                      route_summary: routeOption.label,
                      total_distance_km: fullRoute.distance_km,
                    }));
                  }
                } else {
                  setSelectedRoute(null);
                  setIsRouteLocked(false);
                  setForm(prev => ({
                    ...prev,
                    route_id: null,
                    route_summary: "",
                    total_distance_km: "",
                  }));
                }
              }}

            />
          </div>

          {/* VEHICLE */}
          <Select
            styles={selectStyles}
            placeholder="Select vehicle"
            value={selectedVehicle}
            options={vehicles.map(v => ({
              value: v.id,
              label: v.vehicle_number,
            }))}
            onChange={async (e) => {
              setSelectedVehicle(e);
              setForm(prev => ({ ...prev, vehicle_id: e?.value }));

              if (!isInitialLoad) {
                const res = await getVehicleCurrentDriver(e.value);
                if (res?.drivers?.length) {
                  const d = res.drivers[0];
                  const driverOption = { value: d.driverId, label: d.name };
                  setSelectedPrimaryDriver(driverOption);
                  setForm(prev => ({ ...prev, primary_driver_id: d.driverId }));
                }
              }
            }}
          />

          {/* PRIMARY DRIVER */}
          <Select
            styles={selectStyles}
            placeholder="Primary driver"
            value={selectedPrimaryDriver}
            options={drivers.map(d => ({
              value: d.driverProfile?.id,
              label: d.driverProfile?.name,
            }))}
            onChange={async (e) => {
              setSelectedPrimaryDriver(e);
              setForm(prev => ({ ...prev, primary_driver_id: e?.value }));

              if (!isInitialLoad) {
                const res = await getcurrentDriverVehicle(e.value);
                if (res?.data?.vehicle) {
                  const v = res.data.vehicle;
                  const vehicleOption = { value: v.id, label: v.vehicle_number };
                  setSelectedVehicle(vehicleOption);
                  setForm(prev => ({ ...prev, vehicle_id: v.id }));
                }
              }
            }}
          />

          {/* SECONDARY DRIVER */}
          <Select
            styles={selectStyles}
            placeholder="Secondary driver"
            value={selectedSecondaryDriver}
            options={drivers.map(d => ({
              value: d.driverProfile?.id,
              label: d.driverProfile?.name,
            }))}
            onChange={(e) => {
              setSelectedSecondaryDriver(e);
              setForm(prev => ({ ...prev, secondary_driver_id: e?.value || null }));
            }}
          />

          {/* ROUTE */}
          <div>
            <label className="label">Route</label>
            <Select
              styles={selectStyles}
              placeholder="Select route"
              value={selectedRoute}
              isDisabled={isRouteLocked}
              options={routes.map(r => ({
                value: r.id,
                label: `${r.source_city} → ${r.destination_city}`,
                distance: r.distance_km,
              }))}
              onChange={(e) => {
                setSelectedRoute(e);
                setForm(prev => ({
                  ...prev,
                  route_id: e?.value,
                  route_summary: e?.label,
                  total_distance_km: e?.distance,
                }));
              }}
            />
          </div>

          {/* DISTANCE */}
          <input className="input" value={form.total_distance_km} disabled />

          {/* ETA */}
          <input
            type="date"
            className="input"
            value={form.expected_delivery_date}
            onChange={(e) =>
              setForm(prev => ({ ...prev, expected_delivery_date: e.target.value }))
            }
          />
        </div>

        <div className="px-6 py-4 flex justify-end border-t">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-fleet-primary text-white px-5 py-2 rounded-md"
          >
            Update Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTrip;
