....<template>
  <q-page class="page">
    <PageHeader
      title="PetWeen"
      subtitle="FriendsID: 123456"
    />

    <section class="section">
      <SectionHeader
        title="Pets"
        to="/pets"
      />

      <ScrollerCards>

        <InfoCard
          v-for="i in 10"
          :key="i"
          image="/src/assets/quasar-logo-vertical.svg"
          title="Friend 1"
          info1="Dino"
          info2="Happiness 77%"

        />
      </ScrollerCards>
    </section>

    <section class="section">
      <SectionHeader
        title="Albums"
        to="/albums"
      />

      <ScrollerCards>

        <InfoCard
          v-for="i in 10"
          :key="i"
          image="/src/assets/quasar-logo-vertical.svg"
          title="Friend 1"
          info1="3 Pictures"
          info2=""
        />
      </ScrollerCards>
    </section>
  </q-page>
</template>

<script setup lang="ts">
  import PageHeader from 'src/components/layout/PageHeader.vue'
  import SectionHeader from 'src/components/layout/SectionHeader.vue'
  import ScrollerCards from 'src/components/ui/ScrollerCards.vue'
  import InfoCard from 'src/components/ui/InfoCard.vue'
</script>

<style scoped lang="scss">
  .page {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 1rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .section-header h2 {
    font-size: 1rem;
    margin: 0;
  }

  .section {
    margin-bottom: 1.5rem;
  }

.view-all {
  font-size: 0.75rem;
  opacity: 0.7;
  padding: 0;
}

</style>
