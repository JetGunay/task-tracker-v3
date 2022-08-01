<template>
  <div class="row">
    <div class="col-md-4 col-lg-5">.col-md-4</div>
    <div class="col-12 col-md-8 col-lg-7">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Tasks Today {{ tasks.length }}</h5>
          <div class="card-table">
            <table class="table table-hover">
              <!-- <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">{{ title[0] }}</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Status</th>
                    <th scope="col">Ticket ID</th>
                  </tr>
                </thead> -->
              <tbody>
                <tr v-for="task in tasks" :key="task.id">
                  <td>{{ dateFormat(task.dates.due) }}</td>
                  <td>
                    <span v-if="task.responsibleIds.length > 1">
                      <span v-for="d in task.responsibleIds" :key="d.index">
                        <span
                          v-for="user in users.filter((id) => id.id === d)"
                          :key="user.index"
                        >
                          <div class="tooltip img">
                            <img :src="user.avatarUrl" class="avatar" />
                            <span class="tooltiptext top ava"
                              >{{ user.firstName }} {{ user.lastName }}</span
                            >
                          </div>
                        </span>
                      </span>
                    </span>
                    <span v-else>
                      <span
                        v-for="user in users.filter(
                          (id) => id.id === task.responsibleIds[0]
                        )"
                        :key="user.index"
                      >
                        <div class="tooltip">
                          <img :src="user.avatarUrl" class="avatar" />
                          <span class="tooltiptext top ava"
                            >{{ user.firstName }} {{ user.lastName }}</span
                          >
                        </div>
                      </span>
                    </span>
                  </td>
                  <td>
                    <span
                      v-for="(brand, index) in sortBrands.filter(
                        (id) => id.id === task.superParentIds[0]
                      )"
                      :key="index"
                      class="status"
                      :id="`${brand.id}`"
                    >
                      <span
                        v-for="br in brand.customFields.filter(
                          (id) => id.id === 'IEADVMHZJUABUJGM'
                        )"
                        :key="br.id"
                        >{{ br.value }}</span
                      >
                    </span>
                  </td>
                  <td>
                    <span
                      v-for="stat in stats.filter(
                        (id) => id.id === task.customStatusId
                      )"
                      :key="stat.id"
                      class="status"
                      :id="`${stat.id}`"
                      :style="`color: ${stat.color}`"
                      >{{ stat.name }}</span
                    >
                  </td>
                  <td>
                    <div class="tooltip">
                      <a :href="task.permalink">
                        {{ task.permalink.split("/open.htm?id=").slice(-1)[0] }}
                      </a>
                      <span class="tooltiptext left td">
                        {{ task.title }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-md-12 col-lg-12">
      <div class="card task">
        <div class="card-body">
          <h5 class="card-title">Overdue Tasks: Active</h5>
          <div class="card-table">
            <table class="table table-hover">
              <!-- <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">{{ title[0] }}</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Status</th>
                    <th scope="col">Ticket ID</th>
                  </tr>
                </thead> -->
              <tbody>
                <tr v-for="overdueTask in overdueTasks" :key="overdueTask.id">
                  <td>{{ dateFormat(overdueTask.dates.due) }}</td>
                  <td>
                    <span v-if="overdueTask.responsibleIds.length > 1">
                      <span
                        v-for="d in overdueTask.responsibleIds"
                        :key="d.index"
                      >
                        <span
                          v-for="user in users.filter((id) => id.id === d)"
                          :key="user.index"
                        >
                          <div class="tooltip img">
                            <img :src="user.avatarUrl" class="avatar" />
                            <span class="tooltiptext top ava"
                              >{{ user.firstName }} {{ user.lastName }}</span
                            >
                          </div>
                        </span>
                      </span>
                    </span>
                    <span v-else>
                      <span
                        v-for="user in users.filter(
                          (id) => id.id === overdueTask.responsibleIds[0]
                        )"
                        :key="user.index"
                      >
                        <div class="tooltip">
                          <img :src="user.avatarUrl" class="avatar" />
                          <span class="tooltiptext top ava"
                            >{{ user.firstName }} {{ user.lastName }}</span
                          >
                        </div>
                      </span>
                    </span>
                  </td>
                  <td>
                    <span
                      v-for="(brand, index) in sortBrands.filter(
                        (id) => id.id === overdueTask.superParentIds[0]
                      )"
                      :key="index"
                      class="status"
                      :id="`${brand.id}`"
                    >
                      <span
                        v-for="br in brand.customFields.filter(
                          (id) => id.id === 'IEADVMHZJUABUJGM'
                        )"
                        :key="br.id"
                        >{{ br.value }}</span
                      >
                    </span>
                  </td>
                  <td>
                    <span
                      v-for="stat in stats.filter(
                        (id) => id.id === overdueTask.customStatusId
                      )"
                      :key="stat.id"
                      class="status"
                      :id="`${stat.id}`"
                      :style="`color: ${stat.color}`"
                      >{{ stat.name }}</span
                    >
                  </td>
                  <td>
                    <div class="tooltip">
                      <a :href="overdueTask.permalink">
                        {{
                          overdueTask.permalink
                            .split("/open.htm?id=")
                            .slice(-1)[0]
                        }}
                      </a>
                      <span class="tooltiptext left td">
                        {{ overdueTask.title }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "DashBoard",
  data() {
    return {};
  },
  props: {
    title: Object,
    users: Object,
    overdueTasks: Object,
    stats: Object,
    brands: Object,
    tasks: Object,
  },
  computed: {
    sortBrands() {
      const brands = this.brands.reduce((p, c) => {
        p[c.id] = c;
        return p;
      }, {});
      return Object.values(brands).sort((a, b) => a.id.localeCompare(b.id));
    },
  },
  methods: {
    dateFormat(datetime) {
      let date = moment(String(datetime)).format("Do MMM YY");
      return date;
    },
  },
};
</script>
